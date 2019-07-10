FROM node
RUN mkdir /root/.ssh/
WORKDIR /root/.ssh/
COPY ssh_config config
RUN chmod 600 config
RUN ssh-keyscan -t rsa gitlab.com >> known_hosts

COPY id_docker id_rsa
COPY id_docker.pub id_rsa.pub
RUN chmod 600 id_rsa*
WORKDIR /

COPY Makefile Makefile
EXPOSE 3000
ENTRYPOINT [ "make" ]