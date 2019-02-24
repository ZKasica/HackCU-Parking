ngrok http --host-header=rewrite 4200 --disable-host-check

# Deploying to Cloud Steps
-ng build --prod
-Add backend to folder
-Upload to bucket
-On Google Cloud shell
    -gsutil rsync -r gs://hackcu-parking-1550963549337
    -gcloud app deploy
-Go to 
hackcu-parking-1550963549337.appspot.com


# Set up
Change IP in app.component.ts