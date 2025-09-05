skills = {
    "Formulas": ["SUM", "VLOOKUP", "INDEX-MATCH"],
    "Pivot Tables": ["Basic Pivot", "Grouping"],
    "Charts": ["Bar Chart", "Line Chart"],
    "Data Cleaning": ["Remove Duplicates", "Text-to-Columns"]
}

def next_question(skill: str):
    if skill == "Formulas":
        return "Can you try using VLOOKUP to find a region's sales?"
    return "Please solve this task in the grid."
