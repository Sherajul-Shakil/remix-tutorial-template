import {
  Form, Links, NavLink, LiveReload, Meta,
  Outlet, Scripts, useLoaderData, useNavigation,
  ScrollRestoration, useSubmit,
} from "@remix-run/react";

import {
  LinksFunction, json, redirect,
  LoaderFunctionArgs,
} from "@remix-run/node";

import { useEffect } from "react";
import { debounce } from "lodash";


import appStylesHref from "./app.css";
import { getContacts, createEmptyContact } from "./data";

// Apply css styles to the whole app
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// The loader function is called when the app is first rendered
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

// The action function is called when the form is submitted
export const action = async () => {
  const contact = await createEmptyContact();
  // return json({ contact });
  return redirect(`/contacts/${contact.id}/edit`);
};


// The root component is rendered for every route
export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();


  // useEffect(() => {
  //   const searchField = document.getElementById("q");
  //   if (searchField instanceof HTMLInputElement) {
  //     searchField.value = q || "";
  //   }
  // }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search"
              onChange={(event) =>
                submit(event.currentTarget)
              }

            >
              <input
                aria-label="Search contacts"
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="Search"
                type="search"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    {/* <Link to={`contacts/${contact.id}`}> */}
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                            ? "pending"
                            : ""
                      }
                      to={`contacts/${contact.id}`}
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>

        <div
          className={
            navigation.state === "loading" ? "loading" : ""
          }
          id="detail"
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
