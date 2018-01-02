import sys
from kinto_http import Client


def get_client(user, password):
    return Client(server_url="https://kinto.notmyidea.org/v1",
                  auth=('notes', password),
                  bucket='webnotesapp',
                  collection=user)


def update_tags(user, password):
    client = get_client(user, password)
    with client.batch() as batch:
        records = client.get_records()
        print('got %s records. Updating the tags.', len(records))
        for record in records:
            if 'tag' in record and 'tags' not in record:
                record_tag = record['tag']
                if ',' in record_tag:
                    tags = record_tag.split(',')
                elif '-' in record_tag:
                    tags = record_tag.split('-')
                else:
                    tags = [record_tag, ]
                record['tags'] = tags
            batch.update_record(data=record)
    print("done.")


def main():
    user = sys.argv[1]
    password = sys.argv[2]
    update_tags(user, password)


if __name__ == '__main__':
    main()
