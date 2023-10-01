
import sys
import os
from os.path import join, dirname
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from dotenv import load_dotenv
import pandas as pd
import numpy as np

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from db.traffic import Port, Traffic, Similarity
from migrations import engine


dotenv_path = join(dirname(__file__), '../.env')
load_dotenv(dotenv_path)

INIT_PORT_INFO_PATH = "./data/init_port_info.xlsx"
INIT_PROPORTION_PATH = "./data/init_proportion.xlsx"
INIT_SIMILARITY_PATH = "./data/init_similarity.xlsx"
INVALID_DATA_OUTPUT = "invalid initial data provided"

def same_size(df1, df2, df3):
    size = len(df1)
    return len(df2) == size and len(df3) == size

def is_port_info_valid(df) -> bool:
    if not df.notnull().all().all():
        return False
    for vol in df["volume"]:
        if type(vol) != int:
            return False
        if vol < 0:
            return False
    return True

def is_proportion_valid(df) -> bool:
    if not df.notnull().all().all():
        return False
    size = len(df)
    for i in range(size):
        sum = 0
        for port_to in range(1, size + 1):
            entry = df.iloc[i, port_to]
            if type(entry) is np.float64:
                proportion = int(df.iloc[i, port_to])
            elif type(entry) is str:
                proportion = eval(df.iloc[i, port_to])
            else:
                return False
            if proportion < 0 or proportion > 1:
                return False
            sum += proportion
        if round(sum, 3) != 1:
            return False
    return True

def is_similarity_valid(df) -> bool:
    if not df.notnull().all().all():
        return False
    size = len(df)
    for i in range(size):
        sum = 0
        for port_to in range(1, size + 1):
            entry = df.iloc[i, port_to]
            if type(entry) is np.float64:
                similarity = df.iloc[i, port_to]
            elif type(entry) is str:
                similarity = eval(df.iloc[i, port_to])
            else:
                print(type(entry))
                return False
            if similarity < 0:
                return False
            sum += similarity
        if sum == 0:
            return False
    return True

def init_port_info(df):
    size = len(df)
    with Session(engine) as session:
        name_col = df["name"]
        country_col = df["country"]
        volume_col = df["volume"]
        for i in range(size):
            port = Port(
                name= str(name_col[i]),
                country_code = str(country_col[i]),
                volume = int(volume_col[i])
            )
            session.add(port)
        session.commit()

def init_proportion(df):
    size = len(df)
    with Session(engine) as session:
        for i in range(size):
            port_from = i + 1
            for port_to in range(1, size + 1):
                entry = df.iloc[i, port_to]
                if type(entry) is np.float64:
                    proportion = float(df.iloc[i, port_to])
                else:
                    proportion = eval(df.iloc[i, port_to])
                traffic = Traffic(
                    port_from_id = port_from,
                    port_to_id = port_to,
                    proportion = proportion
                )
                session.add(traffic)
        session.commit()

def init_similarity(df):
    size = len(df)
    with Session(engine) as session:
        for i in range(size):
            port_from = i + 1
            for port_to in range(1, size + 1):
                entry = df.iloc[i, port_to]
                if type(entry) is np.float64:
                    value = float(df.iloc[i, port_to])
                else:
                    value = eval(df.iloc[i, port_to])
                similarity = Similarity(
                    port_from_id = port_from,
                    port_to_id = port_to,
                    value = value
                )
                session.add(similarity)
        session.commit()

def init_traffic_data():
    with Session(engine) as session:
        session.query(Traffic).delete()
        session.query(Similarity).delete()
        session.query(Port).delete()
        session.commit()
    port_info_df = pd.read_excel(INIT_PORT_INFO_PATH)
    proportion_df = pd.read_excel(INIT_PROPORTION_PATH)
    similarity_df = pd.read_excel(INIT_SIMILARITY_PATH)

    if not same_size(port_info_df, proportion_df, similarity_df):
        print(INVALID_DATA_OUTPUT)

    elif not(is_port_info_valid(port_info_df) 
           and is_proportion_valid(proportion_df)
           and is_similarity_valid(similarity_df)):
        print(INVALID_DATA_OUTPUT)
    else:
        init_port_info(port_info_df)
        init_proportion(proportion_df)
        init_similarity(similarity_df)

if __name__ == '__main__':
    init_traffic_data()
