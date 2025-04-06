import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from langchain_core.runnables import Runnable
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools.gmaps import get_neighborhood_info

# Claude LLM setup
llm = ChatAnthropic(
    model="claude-3-7-sonnet-20250219", 
    temperature=0.3,
    anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
)

# Tool list
tools = [get_neighborhood_info]

# # Prompt for Claude-compatible agent
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful real estate AI assistant."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

# Claude will see input, use tools, and summarize
agent = create_tool_calling_agent(llm=llm, tools=tools, prompt=prompt)

# Runnable wrapper
agent_executor: Runnable = AgentExecutor(agent=agent, tools=tools, verbose=True)

def run_agent(question: str) -> str:
    result = agent_executor.invoke({
        "input": question,
        "chat_history": [],
    })
    print("Claude said:", result["output"])
    return result["output"]  # ✅ only return the final answer string

# from langchain_anthropic import ChatAnthropic
# from langchain.agents import create_tool_calling_agent
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.runnables import Runnable
# from langchain.agents import AgentExecutor
# from tools.gmaps import get_neighborhood_info

# load_dotenv()

# # Claude setup
# llm = ChatAnthropic(
#     model="claude-3-7-sonnet-20250219",
#     temperature=0.3,
#     anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
# )

# tools = [get_neighborhood_info]

# # Prompt for Claude-compatible agent
# prompt = ChatPromptTemplate.from_messages([
#     ("system", "You are a helpful real estate AI assistant."),
#     MessagesPlaceholder(variable_name="chat_history"),
#     ("human", "{input}"),
#     MessagesPlaceholder(variable_name="agent_scratchpad")
# ])

# # ✅ Claude-compatible LCEL agent (NO functions=!)
# agent: Runnable = create_tool_calling_agent(
#     llm=llm,
#     tools=tools,
#     prompt=prompt,
# )

# def run_agent(message: str) -> str:
#     executor = AgentExecutor(agent=agent, tools=[get_neighborhood_info], verbose=True)
#     result = executor.invoke({
#         "input": message,
#         "chat_history": []
#     })

#     if hasattr(result, "content"):
#         return result.content  # Claude's final message
#     return str(result)         # Fallback, in case it's not an object with `.content`



