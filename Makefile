serve:
	cd app && python -m SimpleHTTPServer

github:
	ghp-import -n app
	@git push -fq https://${GH_TOKEN}@github.com/$(TRAVIS_REPO_SLUG).git gh-pages > /dev/null
