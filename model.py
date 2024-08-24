import json

class Item:
    def __init__(self, name, price, score, group):
        self.name = name
        self.price = price
        self.score = score
        self.group = group

def read_items_from_json(file_path, group_name):
    items = []
    with open(file_path, 'r') as file:
        data = json.load(file)
        for entry in data:
            name = entry.get('Name', 'Unknown')
            price = float(entry.get('Price', 0))
            score = entry.get('Benchmark', 0)
            items.append(Item(name, price, score, group_name))
    return items

def select_one_item_per_category(budget, categories, order):
    max_score = 0
    best_combination = []
    total_spent = 0

    # Recursive helper function to explore all combinations
    def find_best_combination(index, current_budget, current_score, current_items):
        nonlocal max_score, best_combination, total_spent
        if index == len(order):
            if current_score > max_score:
                max_score = current_score
                best_combination = current_items.copy()
                total_spent = budget - current_budget
            return

        current_category = order[index]
        for item in current_category:
            if item.price <= current_budget:
                find_best_combination(index + 1, current_budget - item.price, current_score + item.score, current_items + [item])

    find_best_combination(0, budget, 0, [])

    return max_score, best_combination, total_spent

def calculate_best_configuration(budget):
    # Define the paths and groups
    categories_info = {
        "case": "./box.json",
        "cooler": "./cooler.json",
        "cpu": "./cpu.json",
        "gpu": "./gpu.json",
        "memory": "./memory.json",
        "motherboard": "./motherboard.json",
        "power_supply": "./powersupply.json",
        "storage": "./storage.json"
    }

    # Read components from all categories
    categories = [read_items_from_json(path, category) for category, path in categories_info.items()]

    # Define the desired order of selection
    desired_order = ['gpu', 'cpu', 'cooler', 'motherboard', 'memory', 'storage', 'case', 'power_supply']
    ordered_categories = [next(category for category in categories if category[0].group == group) for group in desired_order]

    # Get the best possible configuration within the budget
    max_score, items_selected, total_spent = select_one_item_per_category(budget, ordered_categories, ordered_categories)

    # Prepare the result to return
    result = {
        "max_score": max_score,
        "total_spent": total_spent,
        "items_selected": [item.name for item in items_selected]
    }

    return result
