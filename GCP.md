
For google speech to text ( 1 channel )

```` shell
ffmpeg -i "fixtures\Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm" -vn -ac 1 -ar 16000 -c:a flac output-mono.flac
````