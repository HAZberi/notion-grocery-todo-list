# Notion Grocery Todo List

A simple Node.js script to create a structured set of grocery list pages in Notion with todo lists and store information tables.

## Overview

This script uses the Notion API to create a series of pages with:

- Static page names ("Grocery Shopping - Week 1", "Grocery Shopping - Week 2", "Grocery Shopping - Week 3")
- Todo lists with grocery items
- A table database for tracking store information and costs

## Requirements

- Node.js (12.x or higher)
- Notion account with API access
- A Notion page connected to your integration

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Create a Notion integration**

- Go to [Notion Integrations](https://www.notion.so/my-integrations)
- Click "New integration" and follow the steps
- Make note of your "Internal Integration Token" (this will be your `NOTION_API_KEY`)

3. **Connect a Notion page to your integration**

- Create or open a page in Notion
- Click the three dots menu (⋯) in the top-right corner
- Scroll down and select "Connections"
- In the connections search box, type the name of your integration
- Select your integration to connect it to the page
- Copy the page ID from the URL (it's the part after the workspace name and before the question mark): `https://www.notion.so/workspace/PAGE_ID?...`

4. **Create a .env file**

Create a `.env` file in the root directory with the following content:

```
NOTION_API_KEY=your_integration_token_here
PARENT_PAGE_ID=your_shared_page_id_here
```

Replace `your_integration_token_here` with your API key and `your_shared_page_id_here` with the page ID from step 3.

## Running the Script

Execute the script with:

```bash
node index.js
```

This will create:

- Three grocery shopping pages in your Notion account
- Each page will have a todo list with default grocery items
- Each page will have a table for tracking store information

## Customization

To customize the grocery lists or add more weeks:

1. Open `index.js`
2. Find the `weeklyPages` array in the `createWeeklyGroceryPages` function
3. Modify the `name` and `items` properties or add more objects to the array

Example:

```javascript
const weeklyPages = [
  {
    name: "Grocery Shopping - Week 1",
    items: ["milk", "eggs", "bread"],
  },
  {
    name: "Grocery Shopping - Week 2",
    items: ["chicken", "rice", "vegetables"],
  },
  // Add more weeks here
];
```

## Troubleshooting

- **Authentication errors**: Double-check your `NOTION_API_KEY` in the .env file
- **Permission errors**: Make sure you've connected the page with your integration
- **Page not found**: Verify the `PARENT_PAGE_ID` is correct
