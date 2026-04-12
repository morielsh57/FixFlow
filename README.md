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
The DB table that has been queried, the method that should be used, the expected payload and expected response.<br/><br/><br/>

<table>
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
            {<br/>
                “username” : &lt;string&gt;,<br/>
                “first_name” : &lt;string&gt;,<br/>
                “last_name” : &lt;string&gt;,<br/>
                “email” : &lt;string&gt;, <br/>
                “department” : &lt;int (dep_id)&gt;,<br/>
                “phone_number” : &lt;string&gt;,<br/>
                “password” : &lt;string&gt;<br/>
            }
        </td>
        <td>
            Success: status = 201<br/>
            {<br/>
                "msg" : “User created successfully”<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                "msg" : "user creation failed",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
        <tr>
        <td>users/</td>
        <td>GET</td>
        <td>
            Authentication required<br/>
            NONE
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data" : &lt;list of users&gt;,<br/>
                "msg" : "users list fetched successfully"<br/>
            }
        </td>
    </tr>
        <tr>
        <td>users/&lt;int (id)&gt;/</td>
        <td>GET</td>
        <td>
            Authentication required<br/>
            None
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data" : <br/>
                {<br/>
                    "id": &lt;int&gt;,<br/>
                    "username": &lt;string&gt;,<br/>
                    "first_name": &lt;string&gt;,<br/>
                    "last_name": &lt;string&gt;,<br/>
                    "email": &lt;string&gt;,<br/>
                    "phone_number": &lt;string&gt;,<br/>
                    "department": &lt;Department object&gt;,<br/>
                },<br/>
                "msg" : "user fetched successfully"<br/>
            }
            <hr/>
            Failed: status = 404<br/>
            {<br/>
                "msg" : "user not found",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
    <tr>
        <td>change-password/</td>
        <td>PATCH</td>
        <td>
            {<br/>
            “username” : &lt;string&gt;,<br/>
            “password” : &lt;string&gt;<br/>
            }
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "msg" : "password updated successfully"<br/>
            }
            <hr/>
            Failed: status = 404<br/>
            {<br/>
                "msg" : "user not found",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
    <tr>
        <td>login/</td>
        <td>POST</td>
        <td>
            {<br/>
            “username” : &lt;string&gt;,<br/>
            “password” : &lt;string&gt;<br/>
            }
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
            “refresh” : &lt;string&gt;,<br/>
            “access” : &lt;string&gt;<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                &lt;error_msg&gt;<br/>
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
        <td>
            Authentication required<br/>
            None
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data" : &lt;list of Tickets&gt;,<br/>
                "msg" : "Ticket list fetched successfully"<br/>
            }
        </td>
    </tr>
    <tr>
        <td rowspan="3">issue/&lt;int (id)&gt;/</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>
            Authentication required<br/>
            None
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data" :<br/>
                {<br/>
                    "id":&lt;int&gt;,<br/>
                    "priority": &lt;Priority object&gt;,<br/>
                    "requester": &lt;User object&gt;,<br/>
                    "assigned": &lt;User object&gt;,<br/>
                    "date_created": &lt;Date time string&gt;,<br/>
                    "date_updated": &lt;Date time string&gt;,<br/>
                    "title": &lt;string&gt;,<br/>
                    "description": &lt;string&gt;,<br/>
                    "location": &lt;string&gt;,<br/>
                    "status": &lt;Open/In Progress/Closed&gt;<br/>
                },<br/>
                "msg" : "Ticket fetched successfully"<br/>
            }
            <hr/>
            Failed: status = 404<br/>
            {<br/>
                "msg" : "Ticket not found",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>
            Authentication required<br/>
            Note: can be partial, any of the keys is optional.<br/><br/>
            {<br/>
                “title” : &lt;string&gt; ,<br/>
                “description” : &lt;string&gt; ,<br/>
                “location” : &lt;string&gt; ,<br/>
                “status” : &lt;Open/In Progress/Closed&gt; ,<br/>
                “date_created” : &lt;date_time&gt; ,<br/>
                “date_updated” : &lt;date_time&gt; ,<br/>
                “priority” : &lt;int (id)&gt; ,<br/>
                “assigned” : &lt;int (id)&gt; ,<br/>
                “requester” : &lt;int (id)&gt; ,<br/>
            }
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data" : &lt;Ticket object&gt;,<br/>
                "msg":"Ticket updated successfully"<br/>
            }
            <hr/>
            Failed: status = 404<br/>
            {<br/>
                "msg" : "Ticket not found",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                "msg" : "failed to update Ticket",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
    <tr>
        <td>issues-new/</td>
        <td>POST</td>
        <td>
        Authentication required<br/>
            {<br/>
                “title” : &lt;string&gt; ,<br/>
                “description” : &lt;string&gt; ,<br/>
                “location” : &lt;string&gt; ,<br/>
                “status” : &lt;Open/In Progress/Closed&gt; ,<br/>
                “date_created” : &lt;date_time&gt; ,<br/>
                “date_updated” : &lt;date_time&gt; ,<br/>
                “priority” : &lt;int (id)&gt; ,<br/>
                “assigned” : &lt;int (id)&gt; ,<br/>
                “requester” : &lt;int (id)&gt; ,<br/>
            }
        </td>
        <td>
            Success: status = 201<br/>
            {<br/>
                "data" : &lt;Ticket object&gt;,<br/>
                "msg":"Ticket created successfully"<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                "msg" : "failed to create a Ticket",<br/>
                "error" : &lt;error_msg&gt;<br/>
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
        <td>
            Authentication required<br/>
            None
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data": &lt;list of departments&gt;,<br/>
                "msg":"departments list fetched successfully"<br/>
            }
        </td>
    </tr>
    <tr>
        <td>departments/&lt;int (id)&gt;/</td>
        <td>GET</td>
        <td>
            Authentication required<br/>
            None
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data": &lt;department object&gt;,<br/>
                "msg":"department object fetched successfully"<br/>
            }
            <hr/>
            Failed: status = 404<br/>
            {<br/>
                "detail": "No Departments matches the given query"<br/>
            }
        </td>
    </tr>
    <tr>
        <td>departments/add/</td>
        <td>POST</td>
        <td>
            Authentication required<br/>
            {<br/>
                “title” : &lt;string&gt;<br/>
            }
        </td>
        <td>
            Success: status = 201<br/>
            {<br/>
                "data": &lt;department object&gt;,<br/>
                "msg":"department object created successfully"<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                "msg":"failed to create a department object",<br/>
                "error":&lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
    <tr>
        <td>departments/update/&lt;int (id)&gt;/</td>
        <td>PATCH</td>
        <td>
            Authentication required<br/>
            {<br/>
                “title” : &lt;string&gt;<br/>
            }
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data": <br/>
                    {<br/>
                        "id": &lt;int&gt;,<br/>
                        "title": &lt;string&gt;<br/>
                    },<br/>
                "msg":"department object updated successfully"<br/>
            }
            <hr/>
            Failed: status = 404<br/>
            {<br/>
                "detail": "No Departments matches the given query"<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                "msg":"failed to update a department object",<br/>
                "error":&lt;error_msg&gt;<br/>
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
        <td>
            Authentication required<br/>
            None
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data": &lt;list of priorities&gt;,<br/>
                "msg":"priority list fetched successfully"<br/>
            }
        </td>
    </tr>
    <tr>
        <td>priority/&lt;int (id)&gt;/</td>
        <td>GET</td>
        <td>
            Authentication required<br/>
            None
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data": <br/>
                    {<br/>
                        "id": &lt;int&gt;,<br/>
                        "title": &lt;string&gt;<br/>
                    },<br/> 
                "msg":"priority object fetched successfully"<br/>
            }
            <hr/>
            Failed: status = 404<br/>
            {<br/>
                "msg" : "priority object not found",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
    <tr>
        <td>priority/update/&lt;int (id)&gt;/</td>
        <td>PATCH</td>
        <td>
            Authentication required<br/>
            {<br/>
                “title” : &lt;string&gt;<br/>
            }
        </td>
        <td>
            Success: status = 200<br/>
            {<br/>
                "data": &lt;priority object&gt;,<br/>
                "msg":"priority object updated successfully"<br/>
            }
            <hr/>
            Failed: status = 404<br/>
            {<br/>
                "msg" : "priority object not found",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                "msg" : "failed to update a priority object",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
    <tr>
        <td>priority/add/</td>
        <td>POST</td>
        <td>
            Authentication required<br/>
            {<br/>
                “title” : &lt;string&gt;<br/>
            }
        </td>
        <td>
            Success: status = 201<br/>
            {<br/>
                "data": &lt;priority object&gt;,<br/>
                "msg":"priority object created successfully"<br/>
            }
            <hr/>
            Failed: status = 400<br/>
            {<br/>
                "msg" : "failed to create a priority object",<br/>
                "error" : &lt;error_msg&gt;<br/>
            }
        </td>
    </tr>
</table>
