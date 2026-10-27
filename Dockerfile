# Build args are derived from the qualified exact Git commit by the CI caller.
FROM rust:1.99.1-slim-bookworm@sha256:a24e292b4af7bdee351a31d3a6379972a5652f0ea22a1b6d6883324ac4f5097c AS build
WORKDIR /source
COPY Cargo.toml Cargo.lock ./
COPY crates ./crates
COPY tools ./tools
COPY migrations ./migrations
COPY deploy ./deploy
COPY .sqlx ./.sqlx
ARG REBORN_BUILD_PRODUCT
ARG REBORN_BUILD_VERSION
ARG REBORN_BUILD_COMMIT
ARG REBORN_BUILD_TREE
ARG REBORN_BUILD_ORDINAL
ARG REBORN_BUILD_CHANNEL
ARG REBORN_BUILD_CONTRACT
ENV SQLX_OFFLINE=true
RUN test -n "$REBORN_BUILD_COMMIT" && test -n "$REBORN_BUILD_TREE" && test -n "$REBORN_BUILD_VERSION" && cargo build -p keida-hub-reborn --release --locked

FROM debian:bookworm-slim@sha256:7ff6ba31527b9e336162fa061746c366c4b2032f4d2cff2078bea43f78efe3f8
ARG REBORN_BUILD_VERSION
ARG REBORN_BUILD_COMMIT
ARG REBORN_BUILD_TREE
ARG REBORN_BUILD_CHANNEL
LABEL org.opencontainers.image.title="Keida Hub Reborn" org.opencontainers.image.source="https://github.com/Hizumi-Senpai/Keida-Hub-Reborn" org.opencontainers.image.version="$REBORN_BUILD_VERSION" org.opencontainers.image.revision="$REBORN_BUILD_COMMIT" keida.product="keida-hub-reborn" keida.tree="$REBORN_BUILD_TREE" keida.channel="$REBORN_BUILD_CHANNEL" keida.schema="5"
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=build /source/target/release/keida-hub-reborn /usr/local/bin/keida-hub-reborn
USER 65532:65532
ENV REBORN_BIND=0.0.0.0:8788
EXPOSE 8788
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD ["/usr/local/bin/keida-hub-reborn", "healthcheck"]
ENTRYPOINT ["/usr/local/bin/keida-hub-reborn"]
CMD ["serve"]
