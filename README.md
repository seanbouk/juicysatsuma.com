# Juicy Satsuma Tools

View site at https://seanbouk.github.io/juicysatsuma.com/

## Development Setup

This repository is configured for GitHub Pages hosting. When making changes:

### Important Notes for Future Development

1. **Links must use relative paths** - All internal links in `index.html` use relative paths (e.g., `paintmixer/` not `/paintmixer`) to work correctly with GitHub Pages subdirectory hosting.

2. **Authentication Setup** - This repository uses personal GitHub account (`seanbouk`). If you encounter authentication issues when pushing:
   ```bash
   # Set repository-specific user config (doesn't affect global work settings)
   git config user.name "seanbouk"
   git config user.email "your-personal-email@example.com"

   # If push fails with 403 error, temporarily add username to remote URL
   git remote set-url origin https://seanbouk@github.com/seanbouk/juicysatsuma.com.git
   git push origin master
   # Then restore standard URL
   git remote set-url origin https://github.com/seanbouk/juicysatsuma.com.git
   ```

3. **GitHub Pages Deployment** - Changes pushed to the `master` branch automatically deploy to https://seanbouk.github.io/juicysatsuma.com/

### Project Structure

- `index.html` - Main homepage with tool links
- Individual tool directories: `paintmixer/`, `camerasettings/`, `costings/`, etc.
- Each tool is a self-contained web application

### Making Changes

1. Edit files locally
2. Test locally by opening `index.html` in browser
3. Commit and push changes
4. Changes will be live on GitHub Pages within a few minutes
