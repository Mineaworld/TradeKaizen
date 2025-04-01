# Supabase Storage Policies

For the journal image upload functionality to work properly, you need to set up the following storage policies in your Supabase project:

## 1. Create the "trading-images" bucket

1. Go to your Supabase dashboard
2. Navigate to Storage > Buckets
3. Click "Create Bucket"
4. Name it "trading-images"
5. Set it as public if you want the images to be publicly accessible

## 2. Set up Row Level Security (RLS) policies

For the "trading-images" bucket, add the following policies:

### Select (Read) policy:

- Policy name: `Allow public read`
- Policy definition:

```sql
true
```

### Insert policy:

- Policy name: `Allow authenticated insert`
- Policy definition:

```sql
(bucket_id = 'trading-images' AND auth.role() = 'authenticated')
```

### Update policy:

- Policy name: `Allow users to update own files`
- Policy definition:

```sql
(bucket_id = 'trading-images' AND auth.uid() = owner)
```

### Delete policy:

- Policy name: `Allow users to delete own files`
- Policy definition:

```sql
(bucket_id = 'trading-images' AND auth.uid() = owner)
```

These policies will ensure that:

1. Anyone can view the images (including unauthenticated users)
2. Only authenticated users can upload images
3. Only the owner of an image can update or delete it
