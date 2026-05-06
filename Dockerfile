# Multi-stage Dockerfile for Railway / any container host
# Stage 1: nothing to build — pure static. We just copy files into nginx.
FROM nginx:1.27-alpine

# Replace default nginx config with our own (sets PORT, gzip, caching)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy site files into nginx's web root
COPY . /usr/share/nginx/html

# Remove deploy/dev files from the served directory
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/.dockerignore \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/vercel.json \
          /usr/share/nginx/html/netlify.toml \
          /usr/share/nginx/html/railway.json \
          /usr/share/nginx/html/package.json \
          /usr/share/nginx/html/DEPLOY.md \
          /usr/share/nginx/html/.gitignore && \
    rm -rf /usr/share/nginx/html/.git \
           /usr/share/nginx/html/.claude \
           /usr/share/nginx/html/.github

# Railway sets PORT env var; nginx template substitutes it at startup
ENV PORT=8080
EXPOSE 8080

# nginx official image already runs the template-substitution entrypoint
CMD ["nginx", "-g", "daemon off;"]
