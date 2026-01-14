import mysql.connector

# Connect to RDS as admin
conn = mysql.connector.connect(
    host="fastapi-db.cxdhoyygvtrd.us-east-1.rds.amazonaws.com",
    user="admin",
    password="StrongPassword123"
)

cursor = conn.cursor()

# Create database if it doesn't exist
cursor.execute("CREATE DATABASE IF NOT EXISTS cloud_app;")
print("Database 'cloud_app' created successfully!")

cursor.close()
conn.close()
