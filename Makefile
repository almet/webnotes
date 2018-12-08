upload:
	rsync -P -rvz --delete app/* artichaut:/home/www/notes.notmyidea.org

serve:
	cd app && python -m SimpleHTTPServer
	ghp-import -n app
	@git push -fq https://${GH_TOKEN}@github.com/$(TRAVIS_REPO_SLUG).git gh-pages > /dev/null
