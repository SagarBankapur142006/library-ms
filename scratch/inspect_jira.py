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
    "fields": ["summary", "status", "issuetype", "parent", "description", "assignee", "attachment", "customfield_10020"] # customfield_10020 is typically Sprint
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
            assignee = fields.get('assignee')
            assignee_name = assignee.get('displayName') if assignee else "Unassigned"
            
            attachments = fields.get('attachment', [])
            attachment_names = [a.get('filename') for a in attachments]
            
            sprint_info = fields.get('customfield_10020')
            sprint_name = "None"
            if sprint_info and len(sprint_info) > 0:
                sprint_name = sprint_info[0].get('name') if isinstance(sprint_info, list) else sprint_info.get('name')
            
            print(f"{key} | {summary} | Type: {issuetype} | Status: {status} | Assignee: {assignee_name} | Sprint: {sprint_name} | Attachments: {attachment_names}")
except Exception as e:
    print(f"Error: {e}")
