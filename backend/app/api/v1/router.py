from fastapi import APIRouter
from app.api.v1.endpoints import users, roles, subscriptions, profiles, permissions, role_permissions, roadmaps, technologies, modules,topics, sub_topics, lessons,seo

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(
    permissions.router, prefix="/permissions", tags=["permissions"]
)
api_router.include_router(
    role_permissions.router,
    tags=["role-permissions"],
)

api_router.include_router(roadmaps.router,)
api_router.include_router(technologies.router)
api_router.include_router(modules.router)
api_router.include_router(topics.router)
api_router.include_router(sub_topics.router)
api_router.include_router(lessons.router)
api_router.include_router(seo.router)






