import mysql.connector
import json

conn = mysql.connector.connect(
    host="10.50.7.66",
    user="Kaeyoung", 
    password="Liankai1108",
    database="computer"
)

cursor = conn.cursor()

ls = ['cpu', 'gpu', 'storage', 'box', 'cooler', 'memory', 'motherboard', 'powersupply']

for elem in ls:
    query = "SELECT * FROM " + elem 
    cursor.execute(query)

    rows = cursor.fetchall()

    columns = [desc[0] for desc in cursor.description]
    result = [dict(zip(columns, row)) for row in rows]

    with open(elem + '.json', 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, ensure_ascii=False, indent=4)

cursor.close()
conn.close()
