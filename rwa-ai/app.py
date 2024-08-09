import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from langchain_openai import ChatOpenAI
from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.agents import AgentType
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 

# Load the data
CSV_FILE_PATH = "unique.csv"
df = pd.read_csv(CSV_FILE_PATH)

class QueryRequest(BaseModel):
    query: str

def get_coin_info(df, query):
    query = query.lower().strip()
    results = df[df['name'].str.lower().str.contains(query, na=False) |
                 df['symbol'].str.lower().str.contains(query, na=False)]
    if not results.empty:
        return results
    else:
        return None

def match_fixed_question(query):
    query = query.lower().strip()
    questions = {
        "Top 10 token Market Cap Wise": ["top 10 token market cap wise", "give me top 10 coins according to market cap", "top 10 coins by market cap","give me top 10 tokens according to market cap"],
        "Top 10 Gainers": ["top 10 gainers", "give me top 10 gainers", "top gainers","give me top 10 coins"],
        "Top 10 Losers": ["top 10 losers", "give me top 10 losers", "top losers","give me worst coins"],
        "Top 10 Volume": ["top 10 volume", "give me top 10 by volume","give me top 10 coins according to volume","give me top 10 coins according to 24h volume","top volume"],
        "Top 10 by considering Volume and Less availability across multiple chains, opportunity to bridge and create liquidity in other chains": ["top 10 by volume and less availability", "top 10 by volume and low availability", "opportunity to bridge and create liquidity"],
        "Top 10 Commodities to Tokenize": ["top 10 commodities to tokenize", "best commodities to tokenize", "commodities tokenization opportunity","give me best commodities to tokenize","give me top 10 commodities to tokenize"],
        "Top 10 Real Estate Tokenization Opportunity": ["top 10 real estate tokenization opportunity", "best real estate tokenization", "real estate tokenization"],
        "Top 5 Tokenization Jurisdictions": ["top 5 tokenization jurisdictions", "best tokenization jurisdictions", "top jurisdictions for tokenization"]
    }
    for key, phrases in questions.items():
        for phrase in phrases:
            if phrase in query:
                return key
    return None

def answer_fixed_questions(question):
    if question == "Top 10 token Market Cap Wise":
        result = df.nlargest(10, 'marketCap')[['name', 'marketCap']]
        return result.to_dict(orient='records')
    elif question == "Top 10 Gainers":
        result = df.nlargest(10, 'change')[['name', 'change']]
        return result.to_dict(orient='records')
    elif question == "Top 10 Losers":
        result = df.nsmallest(10, 'change')[['name', 'change']]
        return result.to_dict(orient='records')
    elif question == "Top 10 Volume":
        result = df.nlargest(10, '24hVolume')[['name', '24hVolume']]
        return result.to_dict(orient='records')
    elif question == "Top 10 by considering Volume and Less availability across multiple chains, opportunity to bridge and create liquidity in other chains":
        df['chain_count'] = df['chains'].apply(lambda x: len(eval(x)))
        result = df.sort_values(by=['24hVolume', 'chain_count'], ascending=[False, True]).head(10)[['name', '24hVolume', 'chain_count']]
        return result.to_dict(orient='records')
    elif question == "Top 10 Commodities to Tokenize":
        commodities = [
            "Gold", "Silver", "Real Estate", "Oil", "Copper",
            "Agriculture (such as wheat, corn, soybeans)",
            "Palladium", "Platinum", "Iron", "Aluminum"
        ]
        return {"commodities": commodities}
    elif question == "Top 10 Real Estate Tokenization Opportunity":
        # Placeholder: Assuming real estate tokens have a specific identifier, e.g., based on name or another column
        result = df[df['name'].str.contains("real estate", case=False, na=False)].nlargest(10, 'marketCap')[['name', 'marketCap']]
        return result.to_dict(orient='records')
    elif question == "Top 5 Tokenization Jurisdictions":
        # Placeholder: Implement actual logic for jurisdictions if available in the dataset
        result = df['chains'].explode().value_counts().head(5).reset_index(name='count').rename(columns={'index': 'jurisdiction'})
        return result.to_dict(orient='records')
    else:
        return None

@app.get("/")
def read_root():
    return {"message": "Welcome to the DataFrame ChatBot API"}

@app.post("/query")
def query_data(request: QueryRequest):
    user_prompt = request.query

    # Checking if the user is asking a fixed question
    matched_question = match_fixed_question(user_prompt)
    if matched_question:
        fixed_question_response = answer_fixed_questions(matched_question)
        if fixed_question_response is not None:
            return {"response": fixed_question_response}

    # Checking if the user is asking about a specific coin
    coin_info = get_coin_info(df, user_prompt)
    if coin_info is not None:
        if len(coin_info) == 1:
            coin_info = coin_info.iloc[0]
            assistant_response = f"Here is the information about {coin_info['name']}:\n\n"
            for key, value in coin_info.items():
                assistant_response += f"*{key.capitalize()}*: {value}\n"
        else:
            assistant_response = "I found multiple matches for your query. Here are the names of the coins I found:\n"
            for name in coin_info['name']:
                assistant_response += f"- {name}\n"
            assistant_response += "\nPlease be more specific with your query."
    else:
        # Loading the GPT model
        llm = ChatOpenAI(model="gpt-4o", temperature=0,  openai_api_key=os.environ.get("OPENAI_API_KEY"))

        pandas_df_agent = create_pandas_dataframe_agent(
            llm,
            df,
            verbose=True,
            agent_type=AgentType.OPENAI_FUNCTIONS,
            allow_dangerous_code=True
        )

        messages = [
            {"role": "system", "content": "You are a helpful assistant. Answer the questions based on the provided data."},
            {"role": "user", "content": user_prompt}
        ]

        try:
            response = pandas_df_agent.invoke(messages)
            assistant_response = response["output"]
        except Exception as e:
            assistant_response = f"Sorry, I couldn't process your request. Error: {str(e)}"
            raise HTTPException(status_code=500, detail=assistant_response)

    return {"response": assistant_response}
