"""Validate uploads and store only a small, metadata-free profile image."""
import base64
import binascii
from io import BytesIO
from fastapi import HTTPException
from PIL import Image, ImageOps, UnidentifiedImageError

MAX_BYTES = 2 * 1024 * 1024


def normalize_avatar(value):
    if value is None:
        return None
    try:
        header, encoded = value.split(',', 1)
        formats = {'data:image/jpeg;base64': 'JPEG', 'data:image/png;base64': 'PNG',
                   'data:image/webp;base64': 'WEBP'}
        if header not in formats:
            raise ValueError()
        raw = base64.b64decode(encoded, validate=True)
        if len(raw) > MAX_BYTES:
            raise HTTPException(413, 'La foto debe pesar como máximo 2 MB.')
        with Image.open(BytesIO(raw), formats=['JPEG', 'PNG', 'WEBP']) as image:
            if image.format != formats[header] or image.width * image.height > 16_000_000:
                raise ValueError()
            image.load()
            rgba = ImageOps.fit(ImageOps.exif_transpose(image).convert('RGBA'), (256, 256))
            clean = Image.new('RGB', (256, 256), 'white')
            clean.paste(rgba, mask=rgba.getchannel('A'))
            output = BytesIO()
            clean.save(output, format='JPEG', quality=85)
        return 'data:image/jpeg;base64,' + base64.b64encode(output.getvalue()).decode('ascii')
    except (ValueError, binascii.Error, OSError, UnidentifiedImageError, Image.DecompressionBombError):
        raise HTTPException(422, 'Elige una imagen JPG, PNG o WebP válida de hasta 16 megapíxeles.') from None
