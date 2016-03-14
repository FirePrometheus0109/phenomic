import test from "ava"

import template from "../template"

test("Generate template based on an array of files", (t) => {
  const files = [ "/a.html", "/b.html" ]

  const expected =
  "CACHE MANIFEST\n" +
  "# Appcache generated by Statinamic\n" +
  "/a.html\n" +
  "/b.html\n" +
  "\n" +
  "NETWORK:\n" +
  "*\n" +
  "\n" +
  "FALLBACK:\n" +
  "/foo /foo"

  t.is(template(files, "/foo"), expected)
})

test("Throw error when not providing an array", (t) => {
  t.throws(
    () => template({ foo: "bar" }),
    "You must provide an array for " +
    `generating appcache template\n` +
    "You are prodiving \"object\""
  )
})
