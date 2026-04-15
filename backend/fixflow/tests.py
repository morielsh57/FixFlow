from django.test import TestCase
from django.db.models import ProtectedError
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import Departments, Priority, Issues,CustomUser


class DepartmentsModelTests(TestCase):
    def test_create_department(self):
        """Test creating a department and verifying its fields."""
        dept = Departments.objects.create(title="Finance")
        
        self.assertEqual(dept.title, "Finance")
        self.assertIsNotNone(dept.id)

class PriorityModelTests(TestCase):
    def test_create_priority(self):
        """Test creating a priority level."""
        priority = Priority.objects.create(title="Urgent")
        
        self.assertEqual(priority.title, "Urgent")
        self.assertIsNotNone(priority.id)

class CustomUserModelTests(TestCase):
    def setUp(self):
        self.department = Departments.objects.create(title="Engineering")

    def test_create_custom_user(self):
        """Test that the custom user saves the department and phone number correctly."""
        user = CustomUser.objects.create_user(
            username="johndoe",
            password="securepassword123",
            department=self.department,
            phone_number="050-1112233"
        )
        
        self.assertEqual(user.username, "johndoe")
        self.assertEqual(user.department.title, "Engineering")
        self.assertEqual(user.phone_number, "050-1112233")
        self.assertTrue(user.check_password("securepassword123"))

class IssuesModelExtendedTests(TestCase):
    def setUp(self):
        self.department = Departments.objects.create(title="Maintenance")
        self.priority = Priority.objects.create(title="Low")
        
        self.user_requester = CustomUser.objects.create_user(
            username="req_user", 
            password="pw123", 
            department=self.department,
            phone_number="050-0000001"
        )
        self.user_assignee = CustomUser.objects.create_user(
            username="assign_user", 
            password="pw123", 
            department=self.department,
            phone_number="050-0000002"
        )

    def test_issue_defaults(self):
        """Test that default values (status and dates) are automatically applied."""
        initial_count = Issues.objects.count()
        
        issue = Issues.objects.create(
            title="Fix AC",
            description="AC is leaking.",
            location="Room 101",
            priority=self.priority,
            requester=self.user_requester,
            assigned=self.user_assignee
        )
        
        # Verify the count increased by exactly 1
        self.assertEqual(Issues.objects.count(), initial_count + 1)
        
        # Status should default to OPEN if not explicitly provided
        self.assertEqual(issue.status, Issues.Status.OPEN)
        
        # Dates should be auto-populated
        self.assertIsNotNone(issue.date_created)
        self.assertIsNotNone(issue.date_updated)
        self.assertTrue(issue.date_created <= timezone.now())

    def test_create_issue_successful(self):
        """Test creating an issue and verifying its fields, regardless of existing DB state."""
        # Get the count BEFORE creating the new issue
        initial_count = Issues.objects.count()
        
        issue = Issues.objects.create(
            title="Printer malfunction",
            description="The printer on the 3rd floor is out of ink.",
            location="Floor 3",
            status=Issues.Status.OPEN,
            priority=self.priority,
            requester=self.user_requester,
            assigned=self.user_assignee
        )
        
        # Verify the count increased by exactly 1
        self.assertEqual(Issues.objects.count(), initial_count + 1)
        
        # Verify the data was saved correctly
        self.assertEqual(issue.status, "Open")
        self.assertEqual(issue.title, "Printer malfunction")
        self.assertEqual(issue.requester.username, "req_user")

    def test_user_protect_constraint(self):
        """Test that deleting a user assigned to an issue raises a ProtectedError."""
        initial_issues_count = Issues.objects.count()
        initial_users_count = CustomUser.objects.count()
        
        issue = Issues.objects.create(
            title="Network down",
            description="No internet connection.",
            location="Main Office",
            priority=self.priority,
            requester=self.user_requester,
            assigned=self.user_assignee
        )
        
        # Attempting to delete the assigned user should fail due to on_delete=models.PROTECT
        with self.assertRaises(ProtectedError):
            self.user_assignee.delete()
            
        # Attempting to delete the requester user should also fail
        with self.assertRaises(ProtectedError):
            self.user_requester.delete()
            
        # Verify the new issue and users were NOT deleted
        self.assertEqual(Issues.objects.count(), initial_issues_count + 1)
        self.assertEqual(CustomUser.objects.count(), initial_users_count)

class IssuesAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.department = Departments.objects.create(title="HR")
        self.priority = Priority.objects.create(title="Medium")
        
        self.user = CustomUser.objects.create_user(
            username="api_user", 
            password="testpassword", 
            department=self.department,
            phone_number="054-9876543"
        )
        
        # Authenticate the client to bypass API Authentication
        self.client.force_authenticate(user=self.user)

    def test_get_all_issues_endpoint(self):
        """Test extracting issues from the API, resilient to existing data."""
        Issues.objects.create(
            title="Software License Renewal",
            description="Need to renew Adobe license.",
            location="Remote",
            status=Issues.Status.OPEN,
            priority=self.priority,
            requester=self.user,
            assigned=self.user
        )

        response = self.client.get('/all-issues/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('data' in response.data)
        
        # Instead of expecting exactly 1 item, we expect AT LEAST 1 item
        self.assertGreaterEqual(len(response.data['data']), 1)
        
        # Verify our specific issue is in the returned list
        titles = [issue['title'] for issue in response.data['data']]
        self.assertIn("Software License Renewal", titles)