# Tresses by Shabby

## Project Overview

Tresses by Shabby is a fashion-forward e-commerce website for a wig brand.

The project is being built as part of the HNG AI Engineer Internship individual task.

The goal is to create a functional, polished shopping experience while keeping the product design intentional and distinctive rather than relying on a generic e-commerce template.

---

## Product Goal

Help women discover and purchase wigs for everyday wear and special occasions through a shopping experience that feels:

* Elegant
* Bold
* Premium but approachable
* Fashion-forward
* Memorable

The intended reaction is:

> "I need to look at that again."

The experience should feel like an elegant fashion piece rather than a generic online wig store.

---

## Target Customers

Women looking for wigs for:

* Everyday wear
* Special occasions
* Different personal styles and preferences

The brand should feel premium without being intimidating or inaccessible.

---

## Brand & Visual Direction

### Core visual idea

**Soft power meets fashion editorial.**

The visual identity should combine:

* Bold beauty
* Fashion editorial aesthetics
* Refined execution
* Approachable premium styling

### Colour

Pink must be part of the visual identity.

The pink should feel:

* Soft
* Bold
* Sophisticated
* Mature

Avoid childish, bubblegum, or overly girlish pink.

Do not default to generic black-and-gold luxury styling.

The final colour palette should be chosen deliberately and should allow the product photography to remain the visual focus.

### Typography

Use a fashion-editorial typographic direction.

Prefer expressive editorial typography for major headings and brand moments, paired with a clean, highly readable typeface for:

* Navigation
* Product information
* Prices
* Forms
* Buttons
* Checkout

Typography should create hierarchy rather than sacrifice usability for aesthetics.

### Photography

Product photography is central to the experience.

The catalogue should prioritise close-up product imagery.

Where appropriate, product imagery can transition between:

1. A close-up of the wig
2. A model wearing or putting on the wig

Hover interactions may be used on desktop.

Because hover does not exist on touch devices, mobile must have an intentional alternative rather than depending on hover.

Animations should be subtle and editorial, not distracting.

---

## UX Principles

1. The product should remain the main character.
2. Visual personality should come from intentional composition, typography, imagery, and interaction rather than excessive decoration.
3. Users should be able to browse quickly without being forced through unnecessary steps.
4. Users should be able to inspect a product before purchasing.
5. Important product information should be available before checkout.
6. Checkout should be straightforward and low-friction.
7. Accessibility and responsive behaviour are requirements, not optional polish.
8. Do not introduce unnecessary features simply because they are technically possible.
9. Do not replace the established visual direction with a generic e-commerce template.

---

## Core Customer Journey

Home
→ Shop
→ Browse products
→ Add to bag OR view product
→ Bag
→ Checkout
→ Guest checkout OR optional Google authentication
→ Place order
→ Save order
→ Confirmation page
→ Confirmation email

---

## Pages

### Home

Purpose:

Communicate what Tresses by Shabby is and guide customers toward shopping.

Potential sections:

* Hero
* Featured products
* Shop by style
* Brand/value section
* Collection CTA

### Shop / Collection

Purpose:

Allow customers to browse available wigs.

Product cards should display enough information to support quick browsing.

Product cards should support:

* Product image
* Product name
* Key product information
* Price
* Add to bag

The product image/name/card area should also be clickable so users can view the full product.

### Product Details

Purpose:

Help customers understand a wig before purchasing.

Include relevant information such as:

* Product imagery
* Product name
* Price
* Description
* Texture
* Construction
* Available lengths
* Availability/stock
* Quantity
* Add to bag

### Bag

Purpose:

Let customers review what they intend to purchase.

Include:

* Product
* Selected variant/length
* Quantity
* Price
* Remove action
* Subtotal
* Checkout CTA

The bag should persist across page refreshes during the shopping session.

### Checkout

Purpose:

Collect the information necessary to fulfil an order.

Collect:

* Customer name
* Email
* Phone number
* Delivery information/address

Google authentication should be available as an optional convenience.

Guest checkout should remain possible.

### Order Confirmation

After a successful order:

* Show clear confirmation
* Display order number
* Show order summary
* Show total
* Tell the customer that a confirmation email has been sent

---

## Product Catalogue

Products represent wigs.

A product may have multiple length variants.

Example:

Human Hair Body Wave Wig

Variants:

* 14"
* 16"
* 18"
* 20"
* 22"

Different variants may have different:

* Prices
* Stock quantities

The selected variant must be retained when a customer adds the item to the bag and when the order is created.

---

## Data Model

The initial data model should support:

### Users

* id
* name
* email
* avatar/profile information where appropriate

### Products

* id
* name
* description
* texture
* construction
* images
* created_at

### Product Variants

* id
* product_id
* length
* price
* stock

### Orders

* id
* user_id (nullable for guest checkout)
* email
* customer_name
* phone
* delivery_address
* total
* status
* created_at

### Order Items

* id
* order_id
* product_variant_id
* quantity
* unit_price
* subtotal

Do not over-engineer the database unless a real product requirement requires it.

---

## Technical Stack

### Frontend

* React
* TypeScript
* Vite

### Database

* Supabase PostgreSQL

### Authentication

* Supabase Auth
* Google OAuth
* Google Cloud Console for OAuth configuration

### Backend

* Supabase Edge Functions

Use server-side functions for operations that require protected credentials or server-side validation.

### Email

* Mailgun

Mailgun is used for transactional emails such as order confirmation.

### Deployment

* Vercel

### Version Control

* Git
* GitHub

---

## Architecture

High-level flow:

Customer
→ React frontend
→ Supabase/database/authentication
→ Supabase Edge Functions where server-side processing is required
→ Mailgun for transactional email

Never expose Mailgun credentials or other private API keys in frontend code.

---

## Checkout & Order Creation

When a customer places an order:

1. Validate the submitted information.
2. Validate the selected products/variants and relevant stock information.
3. Create the order.
4. Create the associated order items.
5. Calculate/store the correct order total.
6. Trigger the confirmation email through a secure server-side function.
7. Show the order confirmation page.

Do not claim that a payment has been processed because this MVP does not include a payment gateway unless that requirement is added later.

---

## Authentication

Google authentication should be implemented using Google OAuth with Supabase Auth.

Authentication should improve the customer experience rather than create unnecessary friction.

Guest checkout is allowed.

Do not force account creation unless a later requirement explicitly requires it.

---

## Scope

The MVP must focus on:

* Product browsing
* Product details
* Product variants
* Shopping bag
* Checkout
* Order persistence
* Google authentication
* Confirmation email
* Responsive and accessible UI

Potential future features such as the following are outside the initial scope unless explicitly added later:

* Wishlist/favourites
* Payment gateway
* Reviews
* Coupons
* Customer order history dashboard
* Abandoned cart recovery
* Recommendation engine
* Admin dashboard

Do not add these features merely for the sake of adding functionality.

---

## Design & Implementation Rules

* Preserve the established visual direction.
* Do not redesign the brand into a generic template.
* Prefer simple, maintainable solutions.
* Avoid unnecessary dependencies.
* Reuse components where appropriate.
* Keep responsive behaviour in mind from the beginning.
* Design for both desktop and touch devices.
* Never rely exclusively on hover for important information or functionality.
* Maintain accessible contrast, focus states, labels, and keyboard navigation.
* Keep interaction animations purposeful and subtle.
* Product imagery should remain visually prominent.
* Do not sacrifice usability for visual effects.

---

## AI Agent Working Rules

Before making changes:

1. Read this file.
2. Inspect the existing project structure.
3. Understand existing implementation before modifying it.
4. Preserve existing product and design decisions.
5. Make the smallest appropriate change for the requested task.
6. Do not rewrite unrelated parts of the project.
7. Do not introduce new libraries without a clear reason.
8. Explain important implementation decisions when they affect architecture or UX.
9. Run appropriate checks after making changes.
10. Do not claim something works without verifying it.

When a requirement is ambiguous, prefer the simplest interpretation that satisfies the product goal and existing requirements.

Do not invent new product requirements.

---

## Important Product Decisions

These decisions have already been made and should not be changed without discussion:

* Tresses by Shabby uses a bold + premium + fashion-editorial visual direction.
* Sophisticated pink is part of the visual identity.
* Product imagery is a major part of the experience.
* Product cards can add directly to the bag.
* Product cards are also clickable to view product details.
* Products support selectable wig lengths.
* Guest checkout is supported.
* Google authentication is optional rather than mandatory before checkout.
* Order confirmation is shown on-site and sent by email.
* A wishlist is not part of the initial MVP.
* A payment gateway is not part of the initial MVP.
* Supabase is the chosen database/backend platform.
* Mailgun is the chosen transactional email service.
* React + TypeScript + Vite is the frontend stack.
* Supabase Edge Functions are the backend/server-side function layer.
* Vercel is the deployment target.

---

## Current Project Status

Current stage:

* Project created with Vite
* React + TypeScript configured
* ESLint selected
* npm dependencies installed
* Development server successfully tested
* AGENTS.md created

Next stage:

Establish the project's design foundation and begin implementing the interface in small, deliberate pieces.