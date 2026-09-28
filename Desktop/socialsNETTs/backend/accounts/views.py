from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from intel.models import TeamUser
from intel.serializers import TeamUserSerializer

from .serializers import EmailTokenObtainPairSerializer, RegisterSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({"access": str(refresh.access_token), "refresh": str(refresh)}, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailTokenObtainPairSerializer


class LogoutView(APIView):
    # The refresh token in the body *is* the credential being invalidated —
    # no separately-valid access token should be required to log out (e.g.
    # the access token may have already expired by the time the user clicks
    # Sign out).
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get("refresh")
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except TokenError:
                pass
        return Response(status=status.HTTP_205_RESET_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
        except TeamUser.DoesNotExist:
            return Response({"detail": "No profile for this account."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TeamUserSerializer(profile).data)

    def patch(self, request):
        try:
            profile = request.user.profile
        except TeamUser.DoesNotExist:
            return Response({"detail": "No profile for this account."}, status=status.HTTP_404_NOT_FOUND)
        name = request.data.get("name")
        email = request.data.get("email")
        if name:
            profile.name = name
        if email and email != profile.email:
            if User.objects.exclude(pk=request.user.pk).filter(username__iexact=email).exists():
                return Response({"email": ["An account with this email already exists."]}, status=status.HTTP_400_BAD_REQUEST)
            profile.email = email
            request.user.email = email
            request.user.username = email
            request.user.save(update_fields=["email", "username"])
        profile.save()
        return Response(TeamUserSerializer(profile).data)
