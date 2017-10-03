upload:
	rsync -P -rvz --delete reader/* artichaut:/home/www/notes.notmyidea.org

serve:
	cd reader && python -m SimpleHTTPServer &
