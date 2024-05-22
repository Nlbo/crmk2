
# CRMK backend

on php container 
1) cp .env.example .env
2) composer install 
3) change in env DB_CONNECTION=mysql
4) 
   DB_HOST=db
   DB_PORT=3306
   DB_DATABASE=db
   DB_USERNAME=user
   DB_PASSWORD=password
5) remove REDIS_PASSWORD FROM .env and (optional if have docker-compose yaml)
front side
6) npx ngcc
7) add to hosts 127.0.0.1 crmk.local
