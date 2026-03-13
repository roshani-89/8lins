import boto3
from botocore.exceptions import ClientError
from app.core.config import settings

def get_s3():
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )

def upload_to_s3(content: bytes, key: str, content_type: str = "application/octet-stream") -> str:
    """Upload bytes to S3, return public URL. Returns placeholder in dev."""
    if not settings.AWS_ACCESS_KEY_ID:
        return f"https://placeholder-s3.local/{key}"
    try:
        s3 = get_s3()
        s3.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=key,
            Body=content,
            ContentType=content_type,
            ServerSideEncryption="AES256",
        )
        return f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
    except ClientError as e:
        raise Exception(f"S3 upload failed: {e}")

def get_presigned_url(key: str, expires: int = 3600) -> str:
    """Generate a presigned URL for private S3 files."""
    s3 = get_s3()
    return s3.generate_presigned_url("get_object", Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key}, ExpiresIn=expires)
