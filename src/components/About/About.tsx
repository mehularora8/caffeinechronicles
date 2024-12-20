export function About() {
    return (
      <section id="about" className="max-w-3xl mx-auto py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Note to the reader:</h2>
        
        <div className="prose prose-lg text-md lg:text-lg md:text-md text-gray-800 text-left">
            <p className=" leading-relaxed mb-6">
                This is a repository of all the local coffee places I’ve been to (<span className="italic">def:</span> any place with &lt; 5 locations at the time of visiting). This list doesn’t include chains. 
            </p>
            <p className=" leading-relaxed mb-6">
                I’m not a proficient coffee taster, so I’m not in pursuit of the perfectly made coffee (though I am always learning more about tasting coffee ;). My goal with this list is to seek out places that deliver amazing experiences and stories over coffee, have immaculate vibes, and meet some super cool people along the way. 
            </p>
            <p>
                With love,<br/><a href='https://mehularora.me' className='text-orange-800'>Mehul</a>.
            </p>
            </div>
      </section>
    );
  }