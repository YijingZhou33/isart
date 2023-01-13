from rest_framework import permissions


class IsAdminOrReadPostOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True

        return request.user.is_admin
    
