import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const data = [
    { leads: "1250" },
    { Task: "48" },
    { customers: "345" },
    { Revenue: "1.2" },
  ];
  return (
    <main>
      <section>
        <header>
          <div className="p-4">
            <h1 className="text-4xl font-black ">
              Hey,Harsh - Here your overview Today
            </h1>
            <p className="mt-4 font-light">Friday,October 10,2025</p>
          </div>
        </header>
        <div>
          {data.map((datas, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page;
