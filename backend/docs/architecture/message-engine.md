# Message Engine Architecture

## Polymorphism
Messages are completely untethered from strings natively.
By utilizing the `type` Enum (`TEXT`, `IMAGE`, `VOICE`, `VIDEO`, `LOCATION`), the frontend parses specific rendering engines natively.

## Attachments
Media binaries do not sit inside the `Message` object. They sit in `Attachment` foreign keys mapping to S3/Cloudfront URLs parsed during Phase 4, keeping the initial fetch query payload extremely lightweight.
