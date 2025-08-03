# Global category configuration for consistent category handling across the application

CATEGORIES = {
    "Food": [
        "Groceries",
        "Restaurant",
        "Coffee",
        "Lunch",
        "Dinner",
        "Snacks",
        "Takeout"
    ],
    "Entertainment": [
        "Movie Night",
        "Netflix",
        "Concert",
        "Theme Park",
        "Gaming",
        "Books",
        "Music"
    ],
    "Health": [
        "Gym Membership",
        "Medical Checkup",
        "Pharmacy",
        "Dental Visit",
        "Vitamins",
        "Fitness"
    ],
    "Utilities": [
        "Internet Bill",
        "Phone Bill",
        "Electricity Bill",
        "Water Bill",
        "Gas Bill",
        "Maintenance"
    ],
    "Transport": [
        "Uber Ride",
        "Gas Station",
        "Bus Ticket",
        "Train Pass",
        "Car Maintenance",
        "Parking",
        "Taxi"
    ],
    "Shopping": [
        "Clothing",
        "Electronics",
        "Home Decor",
        "Books",
        "Accessories",
        "Beauty"
    ],
    "Other": [
        "Miscellaneous",
        "Office Supplies",
        "Gift",
        "Donation",
        "Insurance",
        "Taxes"
    ]
}

def get_available_categories():
    """Get list of all available categories"""
    return list(CATEGORIES.keys())

def get_category_titles(category):
    """Get list of titles for a specific category"""
    return CATEGORIES.get(category, [])

def is_valid_category(category):
    """Check if a category is valid"""
    return category in CATEGORIES

def get_random_title_for_category(category):
    """Get a random title for a specific category"""
    import random
    titles = get_category_titles(category)
    return random.choice(titles) if titles else "Miscellaneous" 