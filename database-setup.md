# Mind Haven Database Setup Guide

This guide provides comprehensive instructions for setting up the Mind Haven application's database schema in Supabase. The database is essential for storing user profiles, appointments, and messages with proper security and relationships.

## Prerequisites

- An active Supabase account and a new project created.
- Access to your Supabase project's Dashboard.
- Basic understanding of SQL and database concepts.

## Setup Methods

### Method 1: Supabase Dashboard (Recommended)

1.  **Access Your Supabase Project:**
    -   Navigate to [supabase.com/dashboard](https://supabase.com/dashboard).
    -   Select your Mind Haven project from the project list.

2.  **Navigate to the SQL Editor:**
    -   Click on the **"SQL Editor"** icon in the left sidebar.
    -   Click **"+ New query"** to create a new SQL session.

3.  **Execute the Schema Script:**
    -   Open the `supabase-schema.sql` file located in the root of this project.
    -   Copy the entire SQL content from the file.
    -   Paste the content into the Supabase SQL editor.
    -   Click the **"Run"** button to execute the script and create your database schema.

4.  **Verify the Installation:**
    -   Navigate to the **"Table Editor"** icon in the left sidebar.
    -   Confirm that the following tables have been created:
        -   `profiles` - Stores user profile data for both care seekers and providers.
        -   `appointments` - Manages appointment data between seekers and providers.
        -   `conversations` - Groups messages into conversations.
        -   `conversation_participants` - Links users to conversations.
        -   `messages` - Stores individual chat messages.

### Method 2: Supabase CLI (For Advanced Users)

If you prefer using command-line tools and have the Supabase CLI installed:

```bash
# Link the local project to your remote Supabase project
# Replace YOUR_PROJECT_REF with your actual project reference
supabase link --project-ref YOUR_PROJECT_REF

# Push the local database schema to your remote Supabase project
supabase db push
```

## Database Schema Details

### Core Tables

#### `profiles` Table
-   **Purpose**: Stores public user information for both care seekers and care providers.
-   **Key Fields**:
    -   `id` (UUID): A reference to the `auth.users.id`.
    -   `first_name` & `last_name` (TEXT): The user's full name.
    -   `role` (TEXT): Differentiates users ('care_seeker' or 'care_provider').
    -   `avatar_url`, `phone`, `dob`, `gender`: Additional profile details.

#### `appointments` Table
-   **Purpose**: Manages appointments scheduled by care seekers with care providers.
-   **Key Fields**:
    -   `seeker_id` (UUID): References the care seeker's profile.
    -   `provider_id` (UUID): References the care provider's profile.
    -   `appointment_date` & `appointment_time`: The scheduled time for the appointment.
    -   `status` (TEXT): The current state of the appointment ('upcoming', 'completed', 'cancelled').

#### `conversations`, `conversation_participants`, and `messages` Tables
-   **Purpose**: To facilitate a secure messaging system.
    -   `conversations`: Defines a channel for messages.
    -   `conversation_participants`: Links users to a conversation.
    -   `messages`: Stores the actual message content sent by users.
-   **Key Fields**:
    -   `conversation_id` (UUID): Links messages and participants to a conversation.
    -   `sender_id` (UUID): Identifies who sent a message.
    -   `text` (TEXT): The content of the message.

### Security Implementation

#### Row Level Security (RLS)
-   **User Data Isolation**: RLS is enabled on all tables to ensure users can only access and manage their own data.
-   **Policies**:
    -   **Profiles**: Users can only insert and update their own profile. All profiles are publicly viewable.
    -   **Appointments**: Users can view appointments where they are either the seeker or the provider. Only care seekers can create new appointments.
    -   **Messaging**: Users can only view conversations they are a part of and can only send messages in those conversations.

### Automation Features

#### Database Triggers
-   **Automatic Profile Creation**: A trigger is set up to automatically create a new user profile in the `profiles` table whenever a new user signs up through Supabase Auth. This simplifies the registration process.

## Post-Setup Verification

1.  **Test the Authentication Flow**:
    -   Try signing up as a new user (both a 'care_seeker' and a 'care_provider').
    -   Check your email to verify the account.
    -   Sign in with the new credentials.
    -   Navigate to the Supabase Dashboard and confirm that a new entry has been created in both the `auth.users` table and your public `profiles` table.

2.  **Validate Data Operations**:
    -   As a care seeker, attempt to book an appointment with a provider.
    -   As a care seeker, send a message to a provider.
    -   Verify that the data appears correctly in the respective tables and that you cannot access data belonging to other users.

## Next Steps

After successfully setting up the database:

1.  **Configure Environment Variables**:
    -   Create a `.env.local` file in your project root.
    -   Add your Supabase Project URL and Anon Key to this file:
        ```
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```
    -   You can find these keys in your Supabase project's "API" settings.

2.  **Install Supabase Client Libraries**:
    -   If you haven't already, install the necessary npm packages:
        ```bash
        npm install @supabase/supabase-js
        ```

3.  **Run the Application**:
    -   Start the development server to test the full application:
        ```bash
        npm run dev
