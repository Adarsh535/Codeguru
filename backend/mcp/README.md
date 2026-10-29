# CodeGuru Database Connector (MCP)

Ye connector Claude ko website ke MongoDB database se jodta hai. Jo cheezein admin panel se manually add/edit hoti hain, wo ab Claude se bol kar ho jaayengi.

Ye `backend/.env` se `MONGODB_URI` aur Cloudinary keys khud padh leta hai. Alag se kuch set nahi karna.

## Claude Desktop me jodna

1. Claude Desktop kholo → **Settings → Developer → Edit Config**
2. `claude_desktop_config.json` me ye daalo (pehle se kuch ho to `mcpServers` ke andar add karo):

```json
{
  "mcpServers": {
    "codeguru": {
      "command": "node",
      "args": ["C:\\Users\\av969\\OneDrive\\Desktop\\Codeguru web\\backend\\mcp\\server.js"]
    }
  }
}
```

3. Claude Desktop band karke dobara kholo. Chat box me tools icon me **codeguru** dikhega.

## Claude Code me jodna

```bash
claude mcp add codeguru --scope user -- node "C:\Users\av969\OneDrive\Desktop\Codeguru web\backend\mcp\server.js"
```

## Kya-kya kar sakte ho

| Tool | Kaam |
|---|---|
| `site_overview` | Saari collections aur unme kitne items hain |
| `describe_collection` | Kisi collection ke fields (kya bharna hai) |
| `list_items` / `get_item` | Data dekhna / dhoondhna |
| `create_item` / `create_many` | Naya data add karna (ek ya bahut saare) |
| `update_item` / `update_many` | Data edit karna |
| `delete_item` | Data delete karna |
| `get_settings` / `update_settings` | Site title, admin phone/email, WhatsApp settings |
| `upload_image` | Computer ki file ya URL ko Cloudinary par upload karke link lena |

Collections: `courses`, `categories`, `banners`, `ads`, `branches`, `team`, `placements`, `nav_menus`, `leads`, `enrollments`.

## Example prompts

- "Website par kitne courses hain, list dikhao"
- "Ek naya course add karo: Python Full Stack, 6 months, ₹25,000, technologies Python, Django, React"
- "Team me naya member jodo: Rahul Verma, DSA Mentor, photo C:\Users\av969\Pictures\rahul.jpg"
- "Saare courses ka batchMode 'Offline' kar do"
- "Placement me Aman Sharma ka package 20 LPA kar do"

## Dhyan rakhne wali baatein

- Ye seedha **live database** par kaam karta hai. Badlav website refresh karne par dikhega.
- Admin, student accounts, passwords aur analytics jaan-boojh kar is connector me nahi hain.
