# LOL Scraper

I wanted to know how long League of Legends I played, so I downloaded all the match data and uploaded the complete data from me. 

## How long did you play?

Since June last year 13 Days

## What's next?

Import all JSON files into Clickhouse DB and try to select some data

## Import into Clickhouse

### Create Schema

```sql
set allow_experimental_object_type = 1
create table data (s String) Engine = Memory;
CREATE TABLE json (o JSON) Engine = MergeTree ORDER BY tuple();
```

### Import Data

```bash
cat games/*.json > games.ndjson
cat games.ndjson | clickhouse-client --query "INSERT INTO data FORMAT JSONAsString"
```

### Map into a JSON table

```sql
insert into json  select s from data;
```
