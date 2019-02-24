import unirest

url = "https://www.faxvin.com/media/img/resources/_states/plates/colorado.jpg"
response = unirest.post("https://macgyverapi-license-plate-recognition-v1.p.rapidapi.com/",
  headers={
    "X-RapidAPI-Key": "6d28789941msh6b6a241242d3bb9p1ed67djsnc7f5b65a099d",
    "Content-Type": "application/json"
  },
  params=("{\"id\":\"3X5D3d2k\",\"key\":\"free\",\"data\":{\"image_url\":\"" + url + "\",\"country\":\"us\",\"numberCandidates\":2}}")
)

print response.code
print response.raw_body
