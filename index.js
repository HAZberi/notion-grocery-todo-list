// Notion Todo List Structure Creator
// This script creates a nested structure of pages with todo lists and tables

const { Client } = require("@notionhq/client");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Parent page ID - the page shared with your integration
const parentPageId = process.env.PARENT_PAGE_ID;

/**
 * Create a child page with todo list and table
 * @param {string} parentId - ID of the parent page
 * @param {string} pageName - Name of the child page to create
 * @param {Array} todoItems - Array of todo items
 */
async function createChildPage(parentId, pageName, todoItems = []) {
  try {
    // Create the child page
    const childPageResponse = await notion.pages.create({
      parent: {
        type: "page_id",
        page_id: parentId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: pageName,
              },
            },
          ],
        },
      },
      children: [
        // Heading for Todo List
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "Tasks" } }],
          },
        },
        // Todo list items
        ...todoItems.map((item) => ({
          object: "block",
          type: "to_do",
          to_do: {
            rich_text: [{ type: "text", text: { content: item } }],
            checked: false,
          },
        })),
        // Spacer
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [],
          },
        },
      ],
    });

    console.log(`Created child page: ${pageName}`);

    // Get the ID of the newly created child page
    const childPageId = childPageResponse.id;

    // Create table database within the child page
    await createTableDatabase(childPageId, pageName);

    return childPageId;
  } catch (error) {
    console.error(
      `Error creating child page ${pageName}:`,
      error.body || error
    );
  }
}

/**
 * Create a table database within a page
 * @param {string} pageId - ID of the page to add the database to
 * @param {string} pageName - Name of the page (used for database title)
 */
async function createTableDatabase(pageId, pageName) {
  try {
    const response = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: pageId,
      },
      title: [
        {
          type: "text",
          text: {
            content: "Store Information",
          },
        },
      ],
      properties: {
        Store: {
          type: "title",
          title: {},
        },
        TotalCost: {
          type: "number",
          number: {
            format: "dollar",
          },
        },
        "Create Date": {
          type: "date",
          date: {},
        },
        "Last Modified": {
          type: "last_edited_time",
          last_edited_time: {},
        },
      },
    });

    console.log(`Created table database in page: ${pageName}`);

    // Add an initial row to the database
    await addRowToDatabase(response.id, "Example Store", 0);

    return response.id;
  } catch (error) {
    console.error(
      `Error creating database in ${pageName}:`,
      error.body || error
    );
  }
}

/**
 * Add a row to a database
 * @param {string} databaseId - ID of the database
 * @param {string} storeName - Store name value
 * @param {number} totalCost - Total cost value
 */
async function addRowToDatabase(databaseId, storeName, totalCost) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Store: {
          title: [
            {
              text: {
                content: storeName,
              },
            },
          ],
        },
        TotalCost: {
          number: totalCost,
        },
        "Create Date": {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    console.log(`Added row to database: ${storeName}`);
    return response.id;
  } catch (error) {
    console.error(`Error adding row to database:`, error.body || error);
  }
}

/**
 * Create weekly grocery pages with static names
 */
async function createWeeklyGroceryPages(parentId) {
  try {
    // Define the weekly pages with static names
    const weeklyPages = [
      {
        name: "Grocery Shopping - Week 1",
        items: ["milk", "eggs", "bread"],
      },
      {
        name: "Grocery Shopping - Week 2",
        items: ["chicken", "rice", "vegetables"],
      },
      {
        name: "Grocery Shopping - Week 3",
        items: ["pasta", "cheese", "tomatoes"],
      },
    ];

    // Create pages with Promise.all
    const groceryPageIds = await Promise.all(
      weeklyPages.map((page) =>
        createChildPage(parentId, page.name, page.items)
      )
    );

    console.log("Created weekly grocery pages with IDs:", groceryPageIds);
    return groceryPageIds;
  } catch (error) {
    console.error("Error creating weekly grocery pages:", error);
  }
}

/**
 * Create a structure with multiple child pages
 */
async function createStructure() {
  try {
    // Create weekly grocery pages with static names
    await createWeeklyGroceryPages(parentPageId);

    console.log("Structure creation completed!");
  } catch (error) {
    console.error("Error creating structure:", error);
  }
}

// Run the script
createStructure();

// Environment variables needed:
// NOTION_API_KEY=your_integration_token
// PARENT_PAGE_ID=your_parent_page_id
