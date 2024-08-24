import mysql.connector
import json

# 1. 连接到MySQL数据库
# 请确保填入正确的数据库信息
conn = mysql.connector.connect(
    host="10.50.7.66",       # 例如 'localhost'
    user="Kaeyoung",   # 数据库用户名
    password="Liankai1108", # 数据库密码
    database="computer"  # 数据库名称
)

# 2. 创建游标对象，用于执行SQL查询
cursor = conn.cursor()

ls = ['cpu', 'gpu', 'storage', 'box', 'cooler', 'memory', 'motherboard', 'powersupply']
# 3. 执行SQL查询，获取数据
for elem in ls:
    query = "SELECT * FROM " + elem  # 替换为你的表名
    cursor.execute(query)

    # 4. 获取查询结果
    rows = cursor.fetchall()

    # 5. 获取列名，构建JSON数据
    columns = [desc[0] for desc in cursor.description]
    result = [dict(zip(columns, row)) for row in rows]

    # 6. 将结果写入JSON文件
    with open(elem + '.json', 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, ensure_ascii=False, indent=4)

# 7. 关闭游标和连接
cursor.close()
conn.close()
