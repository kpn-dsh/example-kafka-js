#!/bin/bash


# -+-----------------------------------------------+-
#      DSH scripts | only if LOCAL_MODE is unset
# -+-----------------------------------------------+-
if [[ -z "${LOCAL_MODE}" ]]; then
 . ${PKI_CONFIG_DIR}/dsh/bootstrap_kafka.sh
else
 echo "INFO: Not running DSH bootscripts because of env LOCAL_MODE"
fi

# -+-----------------------------------------------+-
#      APP scripts or just run your app
# -+-----------------------------------------------+-
exec node ${PKI_CONFIG_DIR}
