upload:
	rsync -P -rvz --delete app/* artichaut:/home/www/notes.notmyidea.org

serve:
	cd app && python -m SimpleHTTPServer
