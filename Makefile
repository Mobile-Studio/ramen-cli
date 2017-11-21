build:
	cp ramen-cli.js ramen-cli
	pkg ramen-cli -c package.json --options expose-gc --out-path binaries
	rm ramen-cli