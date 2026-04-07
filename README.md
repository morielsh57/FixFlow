# FixFlow
FixFlow is a web-based internal issue tracking system for organizations. Employees can open issues, assign them to departments or specific assignees, track status changes, and view a full history log for each issue, all backed by a database and a REST API.

## Members:
Moriel Tomchin <br>
Amit Shlomo Kedem. <br>
Emma Hrinevitzky. <br>
Tal Rozman. <br>
Ido Abodi Amarteli. <br>
Daniel Cohen. <br>

## Technology Requirements

- **DB (MySQL):** Stores users, issues, assignments (department/assignee), and the full change history. Hosted online for smooth and uniform data storage across devices and users.
- **Backend (Python):** Provides an API for authentication, issue management, status updates, department assignment, and history tracking.
- **Frontend (React + TypeScript):** Web UI that includes a login screen, an issues list (issues created by the user and issues assigned to the user), an "open new issue" form, and an issue details page for viewing/updating an existing issue.


### API endpoints
The backend has been written by Daniel Cohen, Amit Shlomo Kedem and Tal Rozman.<br/>
bellow is a table that summarize the available endpoints: <br/>
The DB table that has been queried, the method that should be used, the expected payload and expected response.

<style>
    table, th, td{
        border: 1px solid black;
        border-collapse: collapse;
    }
    tr:hover {
        background-color: #3a3b3b;
    }

</style>
<table style="white-space:pre-line;">
    <tr>
        <th>Table</th>
        <th>Endpoint</th>
        <th>Method</th>
        <th>Expected payload</th>
        <th>Returns</th>
    </tr>
    <!-- USER -->
    <tr>
        <td rowspan="6">User</td>
    </tr>
    <tr>
        <td>add-user/</td>
        <td>POST</td>
        <td>
            {
                “username” : &lt;string&gt;,
                “first_name” : &lt;string&gt;,
                “last_name” : &lt;string&gt;,
                “email” : &lt;string&gt;, 
                “department” : &lt;int (dep_id)&gt;,
                “phone_number” : &lt;string&gt;,
                “password” : &lt;string&gt;
            }
        </td>
        <td>
            Success: status = 201
            {
                "msg" : “User created successfully”
            }
            <hr/>
            Failed: status = 400
            {
                "msg" : "user creation failed",
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
        <tr>
        <td>users/</td>
        <td>GET</td>
        <td>NONE</td>
        <td>
            Success: status = 200
            {
                "data" : &lt;list of users&gt;,
                "msg" : "users list fetched successfully"
            }
        </td>
    </tr>
        <tr>
        <td>users/&lt;int (id)&gt;/</td>
        <td>GET</td>
        <td>None</td>
        <td>
            Success: status = 200
            {
                "data" : &lt;user item&gt;,
                "msg" : "user fetched successfully"
            }
            <hr/>
            Failed: status = 404
            {
                "msg" : "user not found",
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
    <tr>
        <td>change-password/</td>
        <td>PATCH</td>
        <td>
            {
            “username” : &lt;string&gt;,
            “password” : &lt;string&gt;
            }
        </td>
        <td>
            Success: status = 200
            {
                "msg" : "password updated successfully"
            }
            <hr/>
            Failed: status = 404
            {
                "msg" : "user not found",
                "error" : &lt;error_msg&gt;
            }
            <hr/>
            Failed: status = 400
            {
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
    <tr>
        <td>login/</td>
        <td>POST</td>
        <td>
            {
            “username” : &lt;string&gt;,
            “password” : &lt;string&gt;
            }
        </td>
        <td>
            Success: status = 200
            {
            “refresh” : &lt;string&gt;,
            “access” : &lt;string&gt;
            }
            <hr/>
            Failed: status = 400
            {
                &lt;error_msg&gt;
            }
        </td>
    </tr>
    <!-- ISSUES -->
    <tr>
        <td rowspan="6">Issues</td>
    </tr>
    <tr>
        <td>all-issues/</td>
        <td>GET</td>
        <td>None</td>
        <td>
            Success: status = 200
            {
                "data" : &lt;list of Tickets&gt;,
                "msg" : "Ticket list fetched successfully"
            }
        </td>
    </tr>
    <tr>
        <td rowspan="3">issue/&lt;int (id)&gt;/</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>None</td>
        <td>
            Success: status = 200
            {
                "data" : &lt;Ticket item&gt;,
                "msg" : "Ticket fetched successfully"}
            <hr/>
            Failed: status = 404
            {
                "msg" : "Ticket not found",
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>
            Note: can be partial, any of the keys is optional.
            {
                “title” : &lt;string&gt; ,
                “description” : &lt;string&gt; ,
                “location” : &lt;string&gt; ,
                “status” : &lt;Open/In Progress/Closed&gt; ,
                “date_created” : &lt;date_time&gt; ,
                “date_updated” : &lt;date_time&gt; ,
                “priority” : &lt;int (id)&gt; ,
                “assigned” : &lt;int (id)&gt; ,
                “requester” : &lt;int (id)&gt; ,
            }
        </td>
        <td>
            Success: status = 200
            {
                "data" : &lt;Ticket item&gt;,
                "msg":"Ticket updated successfully"
            }
            <hr/>
            Failed: status = 404
            {
                "msg" : "Ticket not found",
                "error" : &lt;error_msg&gt;
            }
            <hr/>
            Failed: status = 400
            {
                "msg" : "failed to update Ticket",
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
    <tr>
        <td>issues-new/</td>
        <td>POST</td>
        <td>
            {
                “title” : &lt;string&gt; ,
                “description” : &lt;string&gt; ,
                “location” : &lt;string&gt; ,
                “status” : &lt;Open/In Progress/Closed&gt; ,
                “date_created” : &lt;date_time&gt; ,
                “date_updated” : &lt;date_time&gt; ,
                “priority” : &lt;int (id)&gt; ,
                “assigned” : &lt;int (id)&gt; ,
                “requester” : &lt;int (id)&gt; ,
            }
        </td>
        <td>
            Success: status = 201
            {
                "data" : &lt;Ticket item&gt;,
                "msg":"Ticket created successfully"
            }
            <hr/>
            Failed: status = 400
            {
                "msg" : "failed to create a Ticket",
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
    <!-- DEPARTMENT -->
    <tr>
        <td rowspan="5">Departments</td>
    </tr>
    <tr>
        <td>departments/</td>
        <td>GET</td>
        <td>None</td>
        <td>
            Success: status = 200
            {
                "data": &lt;list of departments&gt;,
                "msg":"departments list fetched successfully"
            }
        </td>
    </tr>
    <tr>
        <td>departments/&lt;int (id)&gt;/</td>
        <td>GET</td>
        <td>None</td>
        <td>
            Success: status = 200
            {
                "data": &lt;department item&gt;,
                "msg":"department item fetched successfully"
            }
            <hr/>
            Failed: status = 404
            {
                "detail": "No Departments matches the given query"
            }
        </td>
    </tr>
    <tr>
        <td>departments/add/</td>
        <td>POST</td>
        <td>
            {
                “title” : &lt;string&gt;
            }
        </td>
        <td>
            Success: status = 201
            {
                "data": &lt;department item&gt;,
                "msg":"department item created successfully"
            }
            <hr/>
            Failed: status = 400
            {
                "msg":"failed to create a department item",
                "error":&lt;error_msg&gt;
            }
        </td>
    </tr>
    <tr>
        <td>departments/update/&lt;int (id)&gt;/</td>
        <td>PATCH</td>
        <td>
            {
                “title” : &lt;string&gt;
            }
        </td>
        <td>
            Success: status = 200
            {
                "data": &lt;department item&gt;,
                "msg":"department item updated successfully"
            }
            <hr/>
            Failed: status = 404
            {
                "detail": "No Departments matches the given query"
            }
            <hr/>
            Failed: status = 400
            {
                "msg":"failed to update a department item",
                "error":&lt;error_msg&gt;
            }
        </td>
    </tr>
    <!-- Priority -->
    <tr>
        <td rowspan="5">Priority</td>
    </tr>
    <tr>
        <td>priority/</td>
        <td>GET</td>
        <td>None</td>
        <td>
            Success: status = 200
            {
                "data": &lt;list of priorities&gt;,
                "msg":"priority list fetched successfully"
            }
        </td>
    </tr>
    <tr>
        <td>priority/&lt;int (id)&gt;/</td>
        <td>GET</td>
        <td>None</td>
        <td>
            Success: status = 200
            {
                "data": &lt;priority item&gt;,
                "msg":"priority item fetched successfully"
            }
            <hr/>
            Failed: status = 404
            {
                "msg" : "priority item not found",
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
    <tr>
        <td>priority/update/&lt;int (id)&gt;/</td>
        <td>PATCH</td>
        <td>
            {
                “title” : &lt;string&gt;
            }
        </td>
        <td>
            Success: status = 200
            {
                "data": &lt;item&gt;,
                "msg":"priority item updated successfully"
            }
            <hr/>
            Failed: status = 404
            {
                "msg" : "priority item not found",
                "error" : &lt;error_msg&gt;
            }
            <hr/>
            Failed: status = 400
            {
                "msg" : "failed to update a priority item",
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
    <tr>
        <td>priority/add/</td>
        <td>POST</td>
        <td>
            {
                “title” : &lt;string&gt;
            }
        </td>
        <td>
            Success: status = 201
            {
                "data": &lt;item&gt;,
                "msg":"priority item created successfully"
            }
            <hr/>
            Failed: status = 400
            {
                "msg" : "failed to create a priority item",
                "error" : &lt;error_msg&gt;
            }
        </td>
    </tr>
</table>