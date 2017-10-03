# Webnotes

This is a small Firefox extension to publish selection of text with its context (date and URL for now) when `Ctrl+Shift+U` is pressed.

If you want, [have a look at the demo](https://alexis.notmyidea.org/webnotes.ogv) (in french), or [my personal webnotes](https://notes.notmyidea.org).

*Disclaimer: I've done this for myself. I'm happy to share it so other can
use it as well, but I'll probably not commit a lot of time maintaining this!*

## How does it work?

When you hit `Ctrl+Shift+U`, the content of the selection is sent to an
external service (that you have set, which can be under your control, the
service is [a Kinto server](https://kinto-storage.org)).

You can then configure any other application to access the data you saved. With
the current implementation, the stored data is available to everyone (it's my
use case) but it can easily be changed to something else if needed.

In the `app` folder, there is a webpage able to display the notes you've
published. You will just need to change the *server*, *bucket* and *collection*
to match yours.

## How do I install it?

First, clone this repository locally, for instance with:

  $ git clone https://github.com/almet/webnotes.git

Currently, the addon is not signed, so you need to set the
`xpinstall.signatures.required` pref to `false` in the
[about:config](about:config) page.

Then, head to [about:debugging](about:debugging) and select the `manifest.json`
file.

## How to configure it?

Once the extension installed, you need to configure it! Head to
[about:addons](about:addons), enter your kinto instance, bucket and collection
name and then hit save.

Once the values saved, you can initialize the storage by clicking the link.

## Where can I see my notes?

In the `app` folder, there is a webpage able to display the notes you've
published. You will just need to change the *server*, *bucket* and *collection*
to match yours.

The `make serve` command will serve the content of this folder on
http://localhost:8000.
