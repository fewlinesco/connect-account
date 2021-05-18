#!/bin/bash
sleep 10

while true; do
  connect_account_status_code="$(curl -Is https://$CONNECT_ACCOUNT_HOSTNAME | head -1 | cut -d$' ' -f2)"
  dynamo_db_status_code="$(curl -Is $DYNAMODB_ENDPOINT | head -1 | cut -d$' ' -f2)"

  if [[ ($connect_account_status_code == "200") ]] && [[ ($dynamo_db_status_code == "400") ]]; then
    echo "Stack is up and running" && exit 0
  else
    echo "Stack is not ready"
  fi

  sleep 2
done
