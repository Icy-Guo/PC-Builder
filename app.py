from flask import Flask, request, jsonify
from flask_cors import CORS
from model import calculate_best_configuration

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

if __name__ == '__main__':
    app.run(debug=True)

