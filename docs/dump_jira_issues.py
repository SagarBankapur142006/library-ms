import urllib.request
import json
import base64

url = "https://vitstudent-team-r6bfp56o.atlassian.net/rest/api/3/search/jql"
email = "sagar.sbankapur2024@vitstudent.ac.in"
token = "ATATT3xFfGF09fG5kJSnjaziy_BuFidvpRerbD19npfY7lrQJVH-NZaIpZx5-HgE5pHYZG9OiK4ZIZR0ElS3xoch3S_sSO7wmRYCfHjv2PkILw-HnW9iIgLqxWXF9azlfVCxsCln2gotl7v6jzjV9Nw6-XZQDjEVLEQmxJm9kNF6Q9CvSZ1t5aI=01603624"

auth_str = f"{email}:{token}"
auth_bytes = auth_str.encode('utf-8')
auth_b64 = base64.b64encode(auth_bytes).decode('utf-8')

headers = {
    "Authorization": f"Basic {auth_b64}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

body = {
    "jql": "project = SCRUM",
    "maxResults": 100,
    "fields": ["summary", "status", "issuetype", "parent", "description"]
}

req = urllib.request.Request(
    url, 
    data=json.dumps(body).encode('utf-8'),
    headers=headers,
    method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        issues = data.get('issues', [])
        print(f"Total issues: {len(issues)}")
        for issue in sorted(issues, key=lambda x: int(x['key'].split('-')[1])):
            key = issue.get('key')
            fields = issue.get('fields', {})
            summary = fields.get('summary')
            status = fields.get('status', {}).get('name')
            issuetype = fields.get('issuetype', {}).get('name')
            parent = fields.get('parent', {}).get('key') if fields.get('parent') else "None"
            print(f"{key} | {summary} | Type: {issuetype} | Parent: {parent} | Status: {status}")
except Exception as e:
    print(f"Error: {e}")
