from flask import Flask, request, jsonify
from flask_cors import CORS
from model import calculate_best_configuration
import pymysql

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 根路径处理器
@app.route('/')
def home():
    return "<h1>Welcome to the Flask Server</h1>"

@app.route('/submit-budget', methods=['POST'])
def submit_budget():
    try:
        data = request.json
        budget_value = int(data['budget'])

        # 调用计算函数
        result = calculate_best_configuration(budget_value)

        # 返回计算结果
        return jsonify({'status': 'success', 'result': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
db = pymysql.connect(
    host='10.50.7.66',
    user='Kaeyoung',
    password='Liankai1108',
    database='computer',
    port=3306  # Integer port
)
    
@app.route('/submit-comment', methods=['POST'])
def submit():
    data = request.json
    print(f"Received data: {data}")
    print(data['cpu'])
    try:
        with db.cursor() as cursor:
            sql = "INSERT INTO comment (Score, Comment, box, cooler, cpu, gpu, memory, motherboard, powersupply, storage) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"
            cursor.execute(sql, (float(data['rating']), data['comment'], data['box'], data['cooler'], data['cpu'], data['gpu'], data['memory'], data['motherboard'], data['powersupply'], data['storage']))
            db.commit()
            return jsonify({'status': 'success', 'result' : True})
    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({"error": str(e)}),500

if __name__ == '__main__':
    app.run(debug=True)

