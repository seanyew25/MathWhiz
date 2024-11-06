from PIL import Image

# Load the sprite sheet
sprite_sheet = Image.open("/Applications/MAMP/htdocs/is216/MathWhiz/counting_to_1000/dialogue/images/icons.png")

# Define the width and height of each sprite
sprite_width = 48  # replace with actual width of each sprite
sprite_height = 48  # replace with actual height of each sprite

# Number of sprites along the x and y axis
sheet_width, sheet_height = sprite_sheet.size
sprites_per_row = sheet_width // sprite_width
sprites_per_column = sheet_height // sprite_height

# Define the specific sprite position
row = 4
col = 10

# Calculate the position
left = col * sprite_width
upper = row * sprite_height
right = left + sprite_width
lower = upper + sprite_height

# Crop and save the specific sprite
sprite = sprite_sheet.crop((left, upper, right, lower))
sprite.save("/Applications/MAMP/htdocs/is216/MathWhiz/counting_to_1000/dialogue/images/exclamation.png")