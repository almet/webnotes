from kinto_http import Client

source = Client(server_url="https://kinto.notmyidea.org/v1")
destination = Client(server_url="https://kinto.notmyidea.org/v1", auth=('user', 'pass'), bucket='webnotesapp')

records = source.get_records(bucket='ametaireau', collection='notes')
print("got %s records" % len(records))
destination.create_collection(id='ametaireau', permissions={'read': ['system.Everyone']})

for record in records:
    destination.create_record(data=record, collection='ametaireau')
