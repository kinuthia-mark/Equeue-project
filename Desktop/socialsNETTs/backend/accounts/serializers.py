from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from intel.models import TeamUser

User = get_user_model()

_AVATAR_COLORS = ["#6366f1", "#a855f7", "#f59e0b", "#22c55e", "#64748b", "#22d3ee"]


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_email(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        name = validated_data["name"]
        email = validated_data["email"]
        user = User.objects.create_user(username=email, email=email, password=validated_data["password"])
        initials = "".join(p[0] for p in name.split()[:2]).upper() or "NA"
        TeamUser.objects.create(
            id=f"u_{user.pk}",
            name=name,
            email=email,
            initials=initials,
            color=_AVATAR_COLORS[user.pk % len(_AVATAR_COLORS)],
            role="analyst",
            status="active",
            last_active="now",
            user=user,
        )
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Same as simplejwt's pair serializer, but the client sends `email`
    instead of `username` (our User.username is always set to the email).
    `self.username_field` stays the model's real USERNAME_FIELD ("username")
    so the inherited `validate()` still calls `authenticate(username=...)`
    correctly — we just swap the public-facing input field to `email`."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop(self.username_field, None)
        self.fields["email"] = serializers.EmailField()

    def validate(self, attrs):
        attrs[self.username_field] = attrs.pop("email")
        return super().validate(attrs)
